pipeline {
  agent any

  options {
    timestamps()
    skipDefaultCheckout(true)
    timeout(time: 45, unit: 'MINUTES')
  }

  parameters {
    string(name: 'NODE_REPO_URL', defaultValue: 'https://github.com/deepankar19/nodeeks-service.git')
    string(name: 'NODE_REPO_BRANCH', defaultValue: 'main')

    string(name: 'AWS_ACCOUNT_ID', defaultValue: '723338844144')
    string(name: 'AWS_REGION', defaultValue: 'ap-south-1')
    string(name: 'EKS_CLUSTER_NAME', defaultValue: 'foodadvocate')
    string(name: 'K8S_NAMESPACE', defaultValue: 'default')

    string(name: 'NODE_ECR_REPOSITORY', defaultValue: 'nodeeks-service')
    string(name: 'IMAGE_TAG', defaultValue: '')
  }

  environment {
    KUBECONFIG = "${WORKSPACE}/.kube/config"
    AWS_REGION = "${params.AWS_REGION ?: 'ap-south-1'}"
    EKS_CLUSTER_NAME = "${params.EKS_CLUSTER_NAME ?: 'foodadvocate'}"
    K8S_NAMESPACE = "${params.K8S_NAMESPACE ?: 'default'}"
  }

  stages {
    stage('Init Vars') {
      steps {
        script {
          env.AWS_REGION = params.AWS_REGION ?: 'ap-south-1'
          env.EKS_CLUSTER_NAME = params.EKS_CLUSTER_NAME ?: 'foodadvocate'
          env.K8S_NAMESPACE = params.K8S_NAMESPACE ?: 'default'
          env.FINAL_TAG = params.IMAGE_TAG?.trim() ? params.IMAGE_TAG.trim() : env.BUILD_NUMBER
          env.ECR_REGISTRY = "${params.AWS_ACCOUNT_ID ?: '723338844144'}.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
          env.NODE_ECR_REPO_VAL = params.NODE_ECR_REPOSITORY?.trim() ? params.NODE_ECR_REPOSITORY.trim() : 'nodeeks-service'
          env.NODE_IMAGE_URI = "${env.ECR_REGISTRY}/${env.NODE_ECR_REPO_VAL}:${env.FINAL_TAG}"
        }
        echo "Using image: ${env.NODE_IMAGE_URI}"
      }
    }

    stage('Checkout Node Repo') {
      steps {
        deleteDir()
        git branch: "${params.NODE_REPO_BRANCH}", url: "${params.NODE_REPO_URL}"
      }
    }

    stage('Build & Push Node Image') {
      steps {
        withCredentials([
          string(credentialsId: 'AWS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
          string(credentialsId: 'AWS_SECRET_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
        ]) {
          sh '''#!/usr/bin/env bash
            set -euo pipefail

            aws ecr get-login-password --region "${AWS_REGION:-ap-south-1}" \
              | docker login --username AWS --password-stdin "${ECR_REGISTRY:-}"

            docker build -t "${NODE_ECR_REPO_VAL}:${FINAL_TAG}" .
            docker tag "${NODE_ECR_REPO_VAL}:${FINAL_TAG}" "${NODE_IMAGE_URI}"
            docker tag "${NODE_ECR_REPO_VAL}:${FINAL_TAG}" "${ECR_REGISTRY}/${NODE_ECR_REPO_VAL}:latest"

            docker push "${NODE_IMAGE_URI}"
            docker push "${ECR_REGISTRY}/${NODE_ECR_REPO_VAL}:latest"
          '''
        }
      }
    }

    stage('Deploy Node Service') {
      steps {
        withCredentials([
          string(credentialsId: 'AWS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
          string(credentialsId: 'AWS_SECRET_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
        ]) {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            NS="${K8S_NAMESPACE:-default}"

            mkdir -p "$(dirname "${KUBECONFIG}")"
            aws eks update-kubeconfig \
              --name "${EKS_CLUSTER_NAME:-foodadvocate}" \
              --region "${AWS_REGION:-ap-south-1}" \
              --kubeconfig "${KUBECONFIG}"

            kubectl --kubeconfig "${KUBECONFIG}" get ns "${NS}" >/dev/null 2>&1 || \
              kubectl --kubeconfig "${KUBECONFIG}" create ns "${NS}"

            kubectl --kubeconfig "${KUBECONFIG}" apply -f k8s/service.yaml -n "${NS}"
            kubectl --kubeconfig "${KUBECONFIG}" apply -f k8s/deployment.yaml -n "${NS}"

            kubectl --kubeconfig "${KUBECONFIG}" set image deployment/node-service \
              node-service="${NODE_IMAGE_URI}" -n "${NS}"

            kubectl --kubeconfig "${KUBECONFIG}" rollout status deployment/node-service -n "${NS}" --timeout=300s
            kubectl --kubeconfig "${KUBECONFIG}" get deploy,svc,pods -n "${NS}" -o wide
          '''
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}

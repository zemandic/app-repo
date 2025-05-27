pipeline {
    agent any

    environment {
        IMAGE_NAME = "zemandic/myapp"
        GITOPS_REPO = "https://github.com/zemandic/app-repo"
        MANIFEST_PATH = "k8s/myapp-deployment.yaml"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/zemandic/app-repo'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "v${env.BUILD_NUMBER}"
                    sh "docker build -t $IMAGE_NAME:$imageTag ."
                    sh "docker push $IMAGE_NAME:$imageTag"
                    env.IMAGE_TAG = imageTag
                }
            }
        }

        stage('Update Manifests') {
            steps {
                script {
                    sh """
                        git clone $GITOPS_REPO gitops
                        cd gitops
                        sed -i 's|image: .*|image: $IMAGE_NAME:$IMAGE_TAG|' $MANIFEST_PATH
                        git config user.name "jenkins"
                        git config user.email "jenkins@example.com"
                        git commit -am "Update image to $IMAGE_TAG"
                        git push
                    """
                }
            }
        }
    }
}


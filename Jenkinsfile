pipeline {
    agent any

    environment {
        IMAGE_NAME = "zemandic/myapp"
        GITOPS_REPO = "https://github.com/zemandic/gitops-repo.git"
        MANIFEST_PATH = "k8s/myapp-deployment.yaml"
    }

    stages {
        stage('Checkout App Repo') {
            steps {
                git url: 'https://github.com/zemandic/app-repo.git'
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    def imageTag = "v${env.BUILD_NUMBER}"
                    sh "docker build -t $IMAGE_NAME:$imageTag ."
                    sh "docker push $IMAGE_NAME:$imageTag"
                    env.IMAGE_TAG = imageTag
                }
            }
        }

        stage('Update GitOps Manifests') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'zemandic',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {
                    script {
                        sh """
                            rm -rf gitops
                            git clone https://$GIT_USER:$GIT_PASS@github.com/zemandic/gitops-repo.git gitops
                            cd gitops
                            sed -i 's|image: .*|image: $IMAGE_NAME:$IMAGE_TAG|' $MANIFEST_PATH
                            git config user.name "jenkins"
                            git config user.email "jenkins@example.com"
                            git add $MANIFEST_PATH
                            git commit -m "Update image to $IMAGE_TAG"
                            git push https://$GIT_USER:$GIT_PASS@github.com/zemandic/gitops-repo.git HEAD:main
                        """
                    }
                }
            }
        }
    }
}


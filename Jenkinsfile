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
                git branch: 'main', url: 'https://github.com/zemandic/app-repo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    env.IMAGE_TAG = "v${env.BUILD_NUMBER}"
                    sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-jenkins',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $IMAGE_NAME:$IMAGE_TAG
                        docker logout
                    '''
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


pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "yourdockerhubusername/simple-form-app-backend:latest"
        DOCKER_IMAGE_FRONTEND = "yourdockerhubusername/simple-form-app-frontend:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'pdf', url: 'https://github.com/snkalt/simple-form-app.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE_BACKEND ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE_FRONTEND ./frontend'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push $DOCKER_IMAGE_BACKEND'
                    sh 'docker push $DOCKER_IMAGE_FRONTEND'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                  docker-compose down --remove-orphans
                  docker-compose up -d --build
                '''
            }
        }
    }

    post {
        always {
            sh 'docker system prune -f'
        }
    }
}

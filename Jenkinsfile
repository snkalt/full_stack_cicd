pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "392361759693"

        BACKEND_REPO = "simple-notepad-backend"
        FRONTEND_REPO = "simple-notepad-frontend"

        PATH = "/usr/local/bin:$PATH"  // ensures Jenkins can find docker and aws CLI
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'pdf', url: 'https://github.com/snkalt/full_stack_cicd.git'
            }
        }

        stage('Set AWS Credentials') {
            steps {
                // Inject AWS access and secret keys stored in Jenkins credentials
                withCredentials([[$class: 'UsernamePasswordMultiBinding',
                                  credentialsId: 'aws-jenkins-creds',
                                  usernameVariable: 'AWS_ACCESS_KEY_ID',
                                  passwordVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh 'echo "AWS credentials injected for this build"'
                }
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    docker build -t $BACKEND_REPO:latest ./backend
                    docker tag $BACKEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build -t $FRONTEND_REPO:latest ./frontend
                    docker tag $FRONTEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest
                '''
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

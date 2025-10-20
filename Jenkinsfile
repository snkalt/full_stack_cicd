pipeline {
    agent any

    environment {
        AWS_REGION      = "ap-south-1"                     // Your AWS region
        AWS_ACCOUNT_ID  = "392361759693"                  // Replace with your 12-digit AWS account ID

        BACKEND_REPO    = "simple-notepad-backend"       // ECR repo name for backend
        FRONTEND_REPO   = "simple-notepad-frontend"      // ECR repo name for frontend

        // Ensure Jenkins finds local Docker and AWS CLI on macOS
        PATH = "/usr/local/bin:${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'pdf', url: 'https://github.com/snkalt/full_stack_cicd.git'
            }
        }

        stage('Set AWS Credentials') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: '8183f4cd-b85c-4a55-93d1-9db663dbe34a',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    // Set AWS credentials in environment for downstream stages
                    sh 'echo "AWS credentials loaded for Jenkins pipeline"'
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

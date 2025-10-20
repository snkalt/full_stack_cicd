pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"                    // Your AWS region
        AWS_PROFILE = "jenkins"                       // AWS CLI profile for Jenkins IAM user
        AWS_ACCOUNT_ID = "392361759693"              // Replace with your 12-digit AWS account ID

        BACKEND_REPO = "simple-notepad-backend"      // ECR repo name for backend
        FRONTEND_REPO = "simple-notepad-frontend"    // ECR repo name for frontend
    }

    stages {

        stage('Checkout') {
            steps {
                // Checkout the PDF branch from your GitHub repo
                git branch: 'pdf', url: 'https://github.com/snkalt/full_stack_cicd.git'
            }
        }

        stage('Login to ECR') {
            steps {
                // Login to AWS ECR using the Jenkins AWS profile
                sh '''
                    aws --profile $AWS_PROFILE ecr get-login-password --region $AWS_REGION | \
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
                // Deploy using docker-compose (ensure docker-compose.yml is at repo root)
                sh '''
                    docker-compose down --remove-orphans
                    docker-compose up -d --build
                '''
            }
        }
    }

    post {
        always {
            // Clean up dangling Docker images to save space
            sh 'docker system prune -f'
        }
    }
}

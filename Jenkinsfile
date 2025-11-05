pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"                  // Your AWS region
        AWS_ACCOUNT_ID = "392361759693"            // Replace with your 12-digit AWS account ID
        BACKEND_REPO = "simple-notepad-backend"    // ECR repo name for backend
        FRONTEND_REPO = "simple-notepad-frontend"  // ECR repo name for frontend
    }

    stages {

        stage('Checkout') {
            steps {
                // Checkout the PDF branch from your GitHub repo
                git branch: 'pdf', url: 'https://github.com/snkalt/full_stack_cicd.git'
            }
        }

        stage('Set AWS Credentials') {
    steps {
        withAWS(credentials: '8183f4cd-b85c-4a55-93d1-9db663dbe34a', region: "$AWS_REGION") {
            sh 'echo "AWS credentials loaded for Jenkins pipeline"'
        }
    }
}


        stage('Build Backend Image') {
            steps {
                sh '''
                    echo "Building backend Docker image..."
                    docker build -t $BACKEND_REPO:latest ./backend
                    docker tag $BACKEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    echo "Building frontend Docker image..."
                    docker build -t $FRONTEND_REPO:latest ./frontend
                    docker tag $FRONTEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                    echo "Pushing backend image to ECR..."
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest

                    echo "Pushing frontend image to ECR..."
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "Deploying application with docker-compose..."
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

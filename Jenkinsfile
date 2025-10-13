pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"                  // 🟡 Change if needed
        AWS_PROFILE = "jenkins"                   // ✅ Profile configured via aws configure --profile jenkins
        AWS_ACCOUNT_ID = "YOUR_AWS_ACCOUNT_ID"    // 🟡 Replace with your 12-digit AWS Account ID

        BACKEND_REPO = "simple-form-app-backend"  // 🟢 Your ECR repo name for backend
        FRONTEND_REPO = "simple-form-app-frontend"// 🟢 Your ECR repo name for frontend
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'pdf', url: 'https://github.com/snkalt/simple-form-app.git'
            }
        }

        stage('Login to ECR') {
            steps {
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

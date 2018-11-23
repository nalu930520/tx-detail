pipeline {
  agent {
    docker {
      image 'node:9.11-alpine'
      args '-v /var/lib/jenkins:/opt/awsconfig'
    }
  }
  options {
      skipDefaultCheckout(true)
    }
  stages {
    stage('Checkout') {
        post {
          always {
              dingTalk accessToken: '45ef1643835470b4561d6b3597f6f256b7c9a47e032d7e2ca19f079e01c7a211',
              imageUrl: 'https://www.iconsdb.com/icons/preview/orange/info-2-xxl.png',
              jenkinsUrl: 'https://jenkins.mobi.me',
              message: '  Pipeline start...  ',
              notifyPeople: ''
            }
          }
        steps {
          checkout scm
          checkout([$class: 'GitSCM', 
                    branches: [[name: '*/release']], 
                    doGenerateSubmoduleConfigurations: false, 
                    extensions: [[$class: 'SubmoduleOption', 
                                  disableSubmodules: false, 
                                  parentCredentials: false, 
                                  recursiveSubmodules: true, 
                                  reference: '', 
                                  trackingSubmodules: false]], 
                    submoduleCfg: [], 
                    userRemoteConfigs: [[credentialsId: 'd0f6a358-6f2e-4f11-823b-b0c31838f942', 
                                         url: 'https://github.com/mobiwallet/mobi-tx-detail.git']]])    
        }
    }

    stage('Install Dependencies') {
      steps {
                nodejs(nodeJSInstallationName: 'node10.1.0') {
                sh 'npm --version'
                sh 'node --version'
                sh 'npm install'
           }
      }
    }

    stage('Build According Bracnch') {
      steps {
                sh  """
                      if [ ${BRANCH_NAME} = 'develop' ];then
                          npm run build:staging
                      fi
                      if [ ${BRANCH_NAME} = 'master' ];then
                          npm run build:preProduction
                      fi
                      if [ ${BRANCH_NAME} = 'release' ];then
                          npm run build:production
                      fi
                    """
      }
    }

    stage('create staging deployment') {
      when {
              // case insensitive regular expression for truthy values
              expression { env.BRANCH_NAME == 'develop' }
            }
      steps {
        timeout(time: 60, unit: "SECONDS"){
          input 'Are you sure to deploy staging?'
        }
        step([$class: 'AWSCodeDeployPublisher',
              applicationName: 'MOBI-Staging',
              awsAccessKey: '',
              awsSecretKey: '',
              credentials: 'Staging',
              deploymentGroupAppspec: true,
              deploymentGroupName: 'mobi-tx-detail',    //PROJECT_NAME
              deploymentMethod: 'deploy',
              excludes: 'node_modules/',
              iamRoleArn: '',
              includes: '**',
              proxyHost: '',
              proxyPort: 0,
              region: 'cn-north-1',
              s3bucket: 'jenkinscicode',
              s3prefix: 'CodeDeploy/mobi-tx-detail',    //PROJECT_NAME
              subdirectory: '',
              versionFileName: '',
              waitForCompletion: false])
      }
    }

    stage('create preProduction deployment') {
      when {
              // case insensitive regular expression for truthy values
              expression { env.BRANCH_NAME == 'master-pause' }
            }
      steps {
        timeout(time: 60, unit: "SECONDS"){
          input 'Are you sure to deploy preProduction?'
        }
        step([$class: 'AWSCodeDeployPublisher',
              applicationName: 'MOBI-PRE',
              awsAccessKey: '',
              awsSecretKey: '',
              credentials: 'Production',
              deploymentGroupAppspec: true,
              deploymentGroupName: 'mobi-tx-detail',    //PROJECT_NAME
              deploymentMethod: 'deploy',
              excludes: 'node_modules/',
              iamRoleArn: '',
              includes: '**',
              proxyHost: '',
              proxyPort: 0,
              region: 'ap-northeast-1',
              s3bucket: 'jenkinscicode',
              s3prefix: 'CodeDeploy/mobi-tx-detail', //PROJECT_NAME
              subdirectory: '',
              versionFileName: '',
              waitForCompletion: false])
      }
    }

    stage('create production deployment') {
      when {
              // case insensitive regular expression for truthy values
              expression { env.BRANCH_NAME == 'release' }
            }
      steps {
        timeout(time: 60, unit: "SECONDS"){
          input 'Are you sure to deploy prodution?'
        }
        step([$class: 'AWSCodeDeployPublisher',
              applicationName: 'MOBI-Staging',
              awsAccessKey: '',
              awsSecretKey: '',
              credentials: 'Staging',
              deploymentGroupAppspec: true,
              deploymentGroupName: 'prod-mobi-tx-detail',    //PROJECT_NAME
              deploymentMethod: 'deploy',
              excludes: 'node_modules/',
              iamRoleArn: '',
              includes: '**',
              proxyHost: '',
              proxyPort: 0,
              region: 'cn-north-1',
              s3bucket: 'jenkinscicode',
              s3prefix: 'CodeDeploy/prod-mobi-tx-detail',    //PROJECT_NAME
              subdirectory: '',
              versionFileName: '',
              waitForCompletion: false])
      }
    }
  }

  post {

    always {
        echo "One way or another, I have finished and clean up"
        deleteDir()
      }

    aborted {
       dingTalk accessToken: '45ef1643835470b4561d6b3597f6f256b7c9a47e032d7e2ca19f079e01c7a211',
        imageUrl: 'https://www.iconsdb.com/icons/preview/orange/info-2-xxl.png',
        jenkinsUrl: 'https://jenkins.mobi.me',
        message: '  Build Aborted! ',
        notifyPeople: '13761247272'
    }
    fixed {
       dingTalk accessToken: '45ef1643835470b4561d6b3597f6f256b7c9a47e032d7e2ca19f079e01c7a211',
        imageUrl: 'https://www.iconsdb.com/icons/preview/orange/info-2-xxl.png',
        jenkinsUrl: 'https://jenkins.mobi.me',
        message: '  Build Fixed!  ',
        notifyPeople: '13761247272'
      }
    success {
       dingTalk accessToken: '45ef1643835470b4561d6b3597f6f256b7c9a47e032d7e2ca19f079e01c7a211',
        imageUrl: 'https://www.iconsdb.com/icons/preview/royal-blue/check-mark-11-xxl.png',
        jenkinsUrl: 'https://jenkins.mobi.me',
        message: '  Pipeline Success!  ',
        notifyPeople: '13761247272'
      }
    unstable {
       dingTalk accessToken: '45ef1643835470b4561d6b3597f6f256b7c9a47e032d7e2ca19f079e01c7a211',
        imageUrl: 'https://www.iconsdb.com/icons/preview/orange/info-2-xxl.png',
        jenkinsUrl: 'https://jenkins.mobi.me',
        message: '  Pipeline unstable!  ',
        notifyPeople: '13761247272'
      }
    failure {
       dingTalk accessToken: '45ef1643835470b4561d6b3597f6f256b7c9a47e032d7e2ca19f079e01c7a211',
        imageUrl: 'https://www.iconsdb.com/icons/preview/soylent-red/x-mark-3-xxl.png',
        jenkinsUrl: 'https://jenkins.mobi.me',
        message: '  Pipeline failure!  ',
        notifyPeople: '13761247272'
      }
  } //post
  environment {
    Author = 'Vance Li'
  }
}

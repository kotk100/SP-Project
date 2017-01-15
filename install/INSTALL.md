Deployment on AWS Elastic BeanStalk

Step 1: Create an RDS DB Instance

    -Sign in to the AWS Management Console and open the Amazon RDS console at https://console.aws.amazon.com/rds/.
    -In the top-right corner of the AWS Management Console, choose the region in which you want to create the DB instance. This example uses the US West (Oregon) region.
    -Choose Instances.
    -Choose Launch DB Instance.
    -On the Select Engine page, shown following, choose the MariaDB DB engine, and then choose Select.
    -On the Production page, Specify DB Details page and Configure Advanced Settings page fill in the desired settings
    -Choose Launch DB Instance.


Step 2: Creating an AWS Elastic Beanstalk Aplication
    -Open the Elastic Beanstalk console.
    -Choose Create New Application.
    -In the upper right corner, choose Create New Environment from the Actions menu.
    -Choose Web server environment types.
    -For Platform, choose Node.js.
    -For App code, upload application.
    -Choose Create environment.
    
Step 3: Connect app with DB    
    -Open the Amazon RDS console.
    -Choose Instances.
    -Choose the arrow next to the entry for your DB instance to expand the view.
    -Choose the Details tab.
    -In the Security and Network section, the security group associated with the DB instance is shown. Open the link to view the security group in the Amazon EC2 console.
    -In the security group details, choose the Inbound tab.
    -Choose Edit.
    -Choose Add Rule.
    -For Type, choose the DB engine that your application uses.
    -For Source, choose Custom IP, and then type the group ID of the security group. This allows resources in the security group to receive traffic on the database port from other resources in the same group.
    -Choose Save.

    -Open the Elastic Beanstalk console.
    -Navigate to the management console for your environment.
    -Choose Configuration.
    -Choose Instances settings icon (  Edit).
    -For EC2 security groups, type a comma after the name of the auto-generated security group followed by the name of the RDS DB instance's security group. By default, the RDS console creates a security group called rds-launch-wizard.
    -Choose Apply.
    -Read the warning, and then choose Save.
    -Next, pass the connection information to your environment by using environment properties. When you add a DB instance to your environment with the Elastic Beanstalk console, Elastic Beanstalk uses environment properties like RDS_HOSTNAME to pass connection information to your application. You can use the same properties, which will let you use the same application code with both integrated DB instances and external DB instances, or choose your own property name(s).
    -To configure environment properties
    -Open the Elastic Beanstalk console.
    -Navigate to the management console for your environment.
    -Choose Configuration.
    -In the Software Configuration section, choose  Edit.
    -In the Environment Properties section, define the variables that your application reads to construct a connection string. For compatibility with environments that have an integrated RDS DB instance, use the following:
        RDS_DB_NAME – The DB Name shown in the Amazon RDS console.
        RDS_HOSTNAME – The Endpoint of the DB instance shown in the Amazon RDS console.
        RDS_PORT – The Port shown in the Amazon RDS console.
        RDS_USERNAME – The Master Username that you entered when you added the database to your environment.
        RDS_PASSWORD – The Master Password that you entered when you added the database to your environment.
        
    -Choose Apply.


Step 4: Restart your environment's app servers
    -Open the Elastic Beanstalk console.
    -Navigate to the management console for your environment.
    -Choose Actions and then choose Restart App Server(s).

    
Step 5: Done!



Sources:
https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Tutorials.WebServerDB.CreateDBInstance.html
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.RDS.html
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.environments.html

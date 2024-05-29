# Introduction

TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project.

# Getting Started

TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

1. Installation process
2. Software dependencies
3. Latest releases
4. API references

# Build and Test

TODO: Describe and show how to build your code and run the tests.

# Contribute

TODO: Explain how other users and developers can contribute to make your code better.

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:

- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)

# First run this command



# After clone new app 

============backend==================>
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

============frontend==================>
cd  ./plra_frontend
npm i 
npm run dev

============DumData Commands==================>
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 4 >db.json
python manage.py loaddata db.json
<!-- UTF-8 problem occurs during the loaddata command. To resolve this, click on UTF-8 at the bottom of the JSON file button in VS Code. -->

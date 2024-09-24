https://plra.netlify.app/


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

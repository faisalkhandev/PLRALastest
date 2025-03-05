
![Popup message PLRA](https://github.com/user-attachments/assets/041d63a2-6749-4280-a0de-cdc7bc51e4e1)
![PLRA Termination Table](https://github.com/user-attachments/assets/a0620690-00e4-48f1-a861-ca180fc5513d)
![plra NOC Detail](https://github.com/user-attachments/assets/fa57e11c-c66b-4c8b-9ee7-8a4f1825dc75)
![PLRA Login](https://github.com/user-attachments/assets/67d70bbf-bf41-45a6-8ebf-bb5edb307d38)
![PLRA Leave](https://github.com/user-attachments/assets/6f6795aa-90b8-42cf-a84d-3a6b8eeb8ebb)
![PLRA Leave Detail](https://github.com/user-attachments/assets/a5fcb4b8-670f-4009-8138-8a7bf13c4f60)
![PLRA HOmePage](https://github.com/user-attachments/assets/d064b6dd-9b83-46f5-a8cf-1845cd04a058)
![PLRA Home](https://github.com/user-attachments/assets/bc6ab480-f0b2-4604-8d42-ccf3fc94858a)
![PLRA Employee Page](https://github.com/user-attachments/assets/606173c3-a9da-48cd-b2ab-5c621533e249)
![PLRA Approcal](https://github.com/user-attachments/assets/59ac9601-bd21-4923-8d69-48fa60fc399e)
![NOC details page](https://github.com/user-attachments/assets/aa8eea40-44c0-4fc3-8554-5ba7e85a3a84)
![Disciplinary Proceedings Table](https://github.com/user-attachments/assets/79e6ea03-cf1a-443b-84b4-4253fd759fb0)
![Disciplinary Proceedings Dialog](https://github.com/user-attachments/assets/e27da531-8294-40b4-b1b8-2838d0d1bdb0)
![Disciplinary Proceedings Details](https://github.com/user-attachments/assets/e11d1a06-48dc-4734-89cd-604597a82ddc)
![Disciplinary Proceedings Details Process](https://github.com/user-attachments/assets/c3d1e1e0-8df2-489a-a5cf-ad92383fe0ac)
![dashboard PLRA](https://github.com/user-attachments/assets/54782811-ccb9-4e25-853f-d9a9f4da3e17)
![Termination Details](https://github.com/user-attachments/assets/b3932992-4a07-4849-a223-c6e7eacbf632)
![Setup PLRA](https://github.com/user-attachments/assets/85dc7b7d-e16d-4bcb-b952-4a96e4841c66)
![Processes PLRA Dashboard](https://github.com/user-attachments/assets/9d33fdf7-cc6d-4a57-bc52-28cda2a6ba40)


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

# Installation guide

Clone the project into you machine
Inside a terminal enter the project's folder, and type:
```
composer install
cp .env.example .env        # Windows: copy .env.example .env
```

Setup your db credentials on the .env file

and then type in the terminal:
```
php artisan key:generate
php artisan migrate
```

to run the project type
```
php artisan serve
```


Project's api will be available at `127.0.0.1:8000/api` and front on `127.0.0.1:8000`

I used the blade template under resources/views/index.blade.php
as the plain html file
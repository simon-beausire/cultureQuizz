# PHP image used to run the Laravel API (Laravel 8 supports PHP up to 8.1)
FROM php:8.1-cli

# System tools needed by Composer (git, unzip) and by the zip extension (libzip-dev)
RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libzip-dev \
    && docker-php-ext-install pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

# Take the Composer binary from the official Composer image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# The Laravel project is mounted here by docker-compose.yml
WORKDIR /var/www

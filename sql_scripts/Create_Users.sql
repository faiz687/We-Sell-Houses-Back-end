create table Users
(
    UserId   int auto_increment primary key,
    role     varchar(16) default 'user' not null,
    username varchar(30)                not null,
    email    varchar(30)                not null,
    password varchar(128)               not null
);

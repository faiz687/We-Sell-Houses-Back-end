create table roles
(
    name        varchar(16) not null,
    description text        null,
    constraint roles_name_uindex unique (name)
);

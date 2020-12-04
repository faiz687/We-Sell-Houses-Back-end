create table Houses
(
    houseid      int auto_increment  primary key,
    Title        varchar(30)                        not null,
    description  text                               not null,
    category     varchar(30)                        not null,
    offerprice   int                                not null,
    location     varchar(30)                        not null,
    imageURL     longtext                           null,
    underoffer   tinyint(1)                         not null,
    highpriority tinyint(1)                         not null,
    Activated    tinyint(1)                         not null,
    UserId       int                                not null,
    dateCreated  datetime default CURRENT_TIMESTAMP null
);

import peewee

db = peewee.SqliteDatabase('my_database.db')


class BaseModel(peewee.Model):
    class Meta:
        database = db


class User(BaseModel):
    username = peewee.CharField(unique=True)
    province = peewee.CharField()
    city = peewee.CharField()

class LocalFood(BaseModel):
    user = peewee.ForeignKeyField(User, backref='local_foods')
    province = peewee.CharField()
    name = peewee.CharField()
    food_img_base64 = peewee.TextField(null=True)
    weight=peewee.IntegerField()


if __name__ == '__main__':
    #先判断表是否存在，如果不存在则创建表
    if not User.table_exists():
        db.create_tables([User, LocalFood])


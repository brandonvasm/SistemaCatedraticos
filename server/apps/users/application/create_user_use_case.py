from django.contrib.auth import get_user_model

class CreateUserUseCase:
    @staticmethod
    def execute(user_data):
        User = get_user_model()
        f_id = user_data.pop('faculty_id', None)
        
        password = user_data.pop('password', None)
        
        user = User.objects.create_user(
            password=password,
            **user_data
        )
        
        if f_id:
            user.faculty_id_id = f_id 
            user.save()
            
        return user
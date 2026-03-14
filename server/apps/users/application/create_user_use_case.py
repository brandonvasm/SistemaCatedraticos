from django.contrib.auth import get_user_model

class CreateUserUseCase:
    @staticmethod
    def execute(user_data):
        User = get_user_model()
        
        user = User.objects.create_user(
            email=user_data['email'],
            username=user_data['username'],
            password=user_data['password'],
            role=user_data.get('role', 'coordinator')
            faculty_id=user_data.get('faculty_id')
        )
            
        return user
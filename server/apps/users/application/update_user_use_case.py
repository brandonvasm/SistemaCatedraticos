

class UpdateUserUseCase:
    @staticmethod
    def execute(request_user, target_user, data):
        if 'role' in data:
            if request_user == target_user or request_user.role != 'admin':
                data.pop('role')

        if 'password' in data:
            target_user.set_password(data.pop('password'))

        if request_user.role != 'admin' and 'faculty_id' in data:
            data.pop('faculty_id')

        if request_user.role != 'admin' and 'is_active' in data:
            if request_user == target_user:
                data.pop('is_active')

        for attr, value in data.items():
            setattr(target_user, attr, value)
        
        target_user.save()
        return target_user
    
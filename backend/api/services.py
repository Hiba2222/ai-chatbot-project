from typing import Tuple
from django.contrib.auth.models import User
from .models import UserProfile


def get_or_create_profile(user: User, default_language: str = "en") -> UserProfile:
    """Return the user's profile, creating it if necessary.

    Ensures a single place to define default values and logic.
    """
    profile, _ = UserProfile.objects.get_or_create(
        user=user,
        defaults={"language_preference": default_language},
    )
    return profile

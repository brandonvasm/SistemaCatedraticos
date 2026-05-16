import os
import sys
from urllib.parse import urlparse, urlunparse

from celery import Celery


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api.settings")

app = Celery("api")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


def _hide_url_password(url: str | None) -> str:
    if not url:
        return "not configured"

    parsed = urlparse(url)
    if not parsed.password:
        return url

    username = parsed.username or ""
    hostname = parsed.hostname or ""
    port = f":{parsed.port}" if parsed.port else ""
    netloc = f"{username}:***@{hostname}{port}"
    return urlunparse(parsed._replace(netloc=netloc))


def _should_print_config() -> bool:
    if os.getenv("SHOW_CELERY_CONFIG", "true").lower() in {"0", "false", "no"}:
        return False

    is_runserver = any(argument == "runserver" for argument in sys.argv)
    if is_runserver and os.environ.get("RUN_MAIN") != "true":
        return False

    return True


if _should_print_config():
    print("[Celery] Queue system enabled")
    print("[Celery] Django API -> Redis broker -> Celery worker -> Redis result backend")
    print(f"[Celery] Broker/Redis: {_hide_url_password(app.conf.broker_url)}")
    print(f"[Celery] Result backend: {_hide_url_password(app.conf.result_backend)}")
    print("[Celery] Worker command: celery -A api worker -l info --pool=solo")

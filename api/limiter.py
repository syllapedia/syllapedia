from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    get_remote_address,
    default_limits=["100 per day", "50 per hour"],
    storage_uri="memory://",
)

chatbot_limit = limiter.shared_limit("1/second;15/minute;50/day", scope="chatbot")
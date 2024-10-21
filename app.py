import os
from flask import Flask, render_template, request, redirect, url_for, session
import requests

app = Flask(__name__)
app.secret_key = os.urandom(24)   
  # Generate a secret key for session management

# Your Discord application credentials (replace with your actual values)
DISCORD_CLIENT_ID = os.environ.get('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.environ.get('DISCORD_CLIENT_SECRET')
DISCORD_REDIRECT_URI = os.environ.get('DISCORD_REDIRECT_URI')   
  # e.g., 'http://localhost:5000/callback'
DISCORD_SERVER_ID = os.environ.get('DISCORD_SERVER_ID')  # Your Discord server ID

# OAuth2 authorization URL
DISCORD_AUTH_URL = (
    "https://discord.com/api/oauth2/authorize?"
    f"client_id={DISCORD_CLIENT_ID}&"
    f"redirect_uri={DISCORD_REDIRECT_URI}&"
    "response_type=code&"
    "scope=identify%20guilds.members.read"
)

@app.route('/')
def index():
    # Check if user is already logged in (has session data)
    if 'user_id' in session:
        return redirect(url_for('congratulations'))
    return render_template('index.html', auth_url=DISCORD_AUTH_URL)

@app.route('/callback')
def callback():
    # Get authorization code from Discord
    code = request.args.get('code')

    # Exchange code for access token
    data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri':   
 DISCORD_REDIRECT_URI,   

    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    response = requests.post(
        "https://discord.com/api/oauth2/token", data=data, headers=headers   

    )
    response.raise_for_status()  # Raise an exception for error responses
    token_data = response.json()
    access_token = token_data.get('access_token')

    # Get user's guilds (servers)
    headers = {'Authorization': f'Bearer {access_token}'}
    guilds_response = requests.get(
        "https://discord.com/api/users/@me/guilds", headers=headers
    )
    guilds_response.raise_for_status()
    guilds = guilds_response.json()

    # Check if user is a member of the specified server
    is_member = any(guild['id'] == DISCORD_SERVER_ID for guild in guilds)

    if is_member:
        # Get user's basic information
        user_response = requests.get(
            "https://discord.com/api/users/@me", headers=headers
        )
        user_response.raise_for_status()
        user_data = user_response.json()

        # Store user information in session (or database) - you'll need to implement this
        session['user_id'] = user_data['id']
        # ... (store other relevant user data) ...

        return redirect(url_for('congratulations'))
    else:
        return redirect(url_for('not_authorized'))

@app.route('/congratulations')
def congratulations():
    # ... (retrieve user data from session or database) ...
    return render_template('congratulations.html')

@app.route('/not_authorized')
def not_authorized():
    return render_template('not_authorized.html')

if __name__ == '__main__':
    app.run(debug=True)
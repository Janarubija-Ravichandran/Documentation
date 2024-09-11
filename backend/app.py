from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Configure CORS to allow requests from all origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration for MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123'
app.config['MYSQL_DB'] = 'aigrant'

# JWT configuration
app.config['JWT_SECRET_KEY'] = 'mndfnfdbfdmnfvsfdvmnfdbvhdfvvbfgnbv'
jwt = JWTManager(app)

mysql = MySQL(app)

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'message': 'All fields are required'}), 400

        cur = mysql.connection.cursor()
        
        # Check if the username or email already exists
        cur.execute("SELECT * FROM users WHERE username=%s OR email=%s", (username, email))
        existing_user = cur.fetchone()

        if existing_user:
            cur.close()
            return jsonify({'message': 'Username or email already exists'}), 400

        # Hash the password using pbkdf2:sha256
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        # Insert the new user into the database
        cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, hashed_password))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Internal server error', 'error': str(e)}), 500
    
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        cur = mysql.connection.cursor()
        
        # Fetch the user by email
        cur.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cur.fetchone()
        cur.close()

        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401

        # Check if the provided password matches the hashed password in the database
        user_password_hash = user[3]  # Assuming the password is the third column
        if not check_password_hash(user_password_hash, password):
            return jsonify({'message': 'Invalid email or password'}), 401

        # Generate JWT token
        access_token = create_access_token(identity=email)

        return jsonify({'token': access_token}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Internal server error', 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

## **API Documentation: Pool Routes**

### **Base URL**
`http://<API_URL>/pools/`

---

### **Authentication**
All routes require authentication via `authMiddleware`. Include the `Authorization` header with a valid JWT token.

---

## **1. Create a Pool**
Create a new pool with a name, description, visibility, and categories.

- **URL**: `/createPool`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "Private Pool for Short Films",
    "description": "A private pool focusing on short film categories",
    "public": false,
    "categories": [
      {
        "category": "nominees.category.animatedShort",
        "weight": 500
      },
      {
        "category": "nominees.category.liveActionShort",
        "weight": 500
      }
    ]
  }
  ```
- **Response**:
  - **Success (201)**:
    ```json
    {
      "_id": "67ab611a2260b61be8b0caff"
    }
    ```
  - **Error (500)**:
    ```json
    {
      "error": "An error occurred while creating the pool."
    }
    ```

---

## **2. Update a Pool**
Update an existing pool. Only admins can update the pool.

- **URL**: `/updatePool/:poolId`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "name": "Updated Pool Name",
    "description": "Updated description",
    "public": true,
    "categories": [
      {
        "category": "nominees.category.animatedShort",
        "weight": 400
      },
      {
        "category": "nominees.category.liveActionShort",
        "weight": 600
      }
    ]
  }
  ```
- **Response**:
  - **Success (200)**: Empty response.
  - **Error (404)**:
    ```json
    {
      "error": "Pool not found."
    }
    ```
  - **Error (403)**:
    ```json
    {
      "error": "Only admins can update the pool."
    }
    ```

---

## **3. Delete a Pool**
Delete a pool. Only the creator can delete the pool.

- **URL**: `/deletePool/:poolId`
- **Method**: `DELETE`
- **Response**:
  - **Success (200)**: Empty response.
  - **Error (404)**:
    ```json
    {
      "error": "Pool not found."
    }
    ```
  - **Error (403)**:
    ```json
    {
      "error": "Only the creator can delete the pool."
    }
    ```

---

## **4. Get Pools by User Number**
Get a list of pools ordered by the number of users in each pool.

- **URL**: `/getPoolsByUserNumber`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (optional): Number of pools to return (default: 10).
  - `cursor` (optional): Cursor for pagination.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "pools": [
        {
          "_id": "67ab611a2260b61be8b0caff",
          "name": "Private Pool for Short Films",
          "description": "A private pool focusing on short film categories",
          "public": false,
          "categories": 2,
          "users": 5,
          "isAdmin": true,
          "isCreator": false,
          "isMember": true
        }
      ],
      "nextCursor": "67ab611a2260b61be8b0caff",
      "hasMore": true
    }
    ```
  - **Error (500)**:
    ```json
    {
      "error": "An error occurred while getting the pools."
    }
    ```

---

## **5. Get Pools by User**
Get a list of pools the current user is in.

- **URL**: `/getPoolsByUser`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (optional): Number of pools to return (default: 10).
  - `cursor` (optional): Cursor for pagination.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "pools": [
        {
          "_id": "67ab611a2260b61be8b0caff",
          "name": "Private Pool for Short Films",
          "description": "A private pool focusing on short film categories",
          "public": false,
          "categories": 2,
          "users": 5,
          "isAdmin": true,
          "isCreator": false,
          "isMember": true
        }
      ],
      "nextCursor": "67ab611a2260b61be8b0caff",
      "hasMore": true
    }
    ```
  - **Error (500)**:
    ```json
    {
      "error": "An error occurred while getting the pools."
    }
    ```

---

## **6. Get Pools by Search**
Search for pools by name or description.

- **URL**: `/getPoolsBySearch`
- **Method**: `GET`
- **Query Parameters**:
  - `search`: Search term.
  - `limit` (optional): Number of pools to return (default: 10).
  - `cursor` (optional): Cursor for pagination.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "pools": [
        {
          "_id": "67ab611a2260b61be8b0caff",
          "name": "Private Pool for Short Films",
          "description": "A private pool focusing on short film categories",
          "public": false,
          "categories": 2,
          "users": 5,
          "isAdmin": true,
          "isCreator": false,
          "isMember": true
        }
      ],
      "nextCursor": "67ab611a2260b61be8b0caff",
      "hasMore": true
    }
    ```
  - **Error (500)**:
    ```json
    {
      "error": "An error occurred while getting the pools."
    }
    ```

---

## **7. Get Pool by Token**
Get pool information by invite token.

- **URL**: `/getPoolByToken/:token`
- **Method**: `GET`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "_id": "67ab611a2260b61be8b0caff",
      "name": "Private Pool for Short Films",
      "description": "A private pool focusing on short film categories",
      "public": false,
      "categories": 2,
      "users": 5,
      "isMember": false
    }
    ```
  - **Error (404)**:
    ```json
    {
      "error": "Pool not found."
    }
    ```

---

## **8. Get Pool Info**
Get detailed information about a pool, including user details.

- **URL**: `/getPoolInfo/:poolId`
- **Method**: `GET`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "_id": "67ab611a2260b61be8b0caff",
      "name": "Private Pool for Short Films",
      "description": "A private pool focusing on short film categories",
      "public": false,
      "categories": [
        {
          "category": "nominees.category.animatedShort",
          "weight": 500
        }
      ],
      "users": [
        {
          "userId": "6792e5ea297fd2ca6f920a66",
          "username": "john_doe",
          "admin": true
        }
      ],
      "createdBy": "admin_user",
      "createdAt": "2025-02-11T14:39:22.308Z"
    }
    ```
  - **Error (404)**:
    ```json
    {
      "error": "Pool not found."
    }
    ```
  - **Error (403)**:
    ```json
    {
      "error": "You are not a member of this pool."
    }
    ```

---

## **9. Get Pool Leaderboard**
Get the leaderboard for a pool, showing user scores based on correct bets.

- **URL**: `/getPoolLeaderboard/:poolId`
- **Method**: `GET`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "leaderboard": [
        {
          "user": "john_doe",
          "score": 800
        }
      ]
    }
    ```
  - **Error (404)**:
    ```json
    {
      "error": "Pool not found."
    }
    ```
  - **Error (403)**:
    ```json
    {
      "error": "You are not a member of this pool."
    }
    ```

---

## **10. Join a Pool**
Join a pool using an invite token (for private pools).

- **URL**: `/joinPool`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "poolId": "67ab611a2260b61be8b0caff",
    "inviteToken": "3e7a4d6c-e7c6-45d7-8851-516ec93d9b69"
  }
  ```
- **Response**:
  - **Success (200)**: Empty response.
  - **Error (404)**:
    ```json
    {
      "error": "Pool not found."
    }
    ```
  - **Error (403)**:
    ```json
    {
      "error": "You are not allowed to join this pool."
    }
    ```

---

## **11. Leave a Pool**
Leave a pool.

- **URL**: `/leavePool/:poolId`
- **Method**: `POST`
- **Response**:
  - **Success (200)**: Empty response.
  - **Error (404)**:
    ```json
    {
      "error": "Pool not found."
    }
    ```
  - **Error (403)**:
    ```json
    {
      "error": "You cannot leave a pool you created."
    }
    ```

---

## **12. Add an Admin**
Add an admin to a pool. Only existing admins can add another admin.

- **URL**: `/addAdmin`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "poolId": "67ab611a2260b61be8b0caff",
    "userId": "6792e5ea297fd2ca6f920a66"
  }
  ```
- **Response**:
  - **Success (200)**: Empty response.
  - **Error (404)**:
    ```json
    {
      "error": "Pool not found."
    }
    ```
  - **Error (403)**:
    ```json
    {
      "error": "Only admins can add another admin."
    }
    ```

---

## **13. Remove an Admin**
Remove an admin from a pool. Only existing admins can remove another admin.

- **URL**: `/removeAdmin`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "poolId": "67ab611a2260b61be8b0caff",
    "userId": "6792e5ea297fd2ca6f920a66"
  }
  ```
- **Response**:
  - **Success (200)**: Empty response.
  - **Error (404)**:
    ```json
    {
      "error": "Pool not found."
    }
    ```
  - **Error (403)**:
    ```json
    {
      "error": "Only admins can remove another admin."
    }
    ```

---

## **14. Ban a User**
Ban a user from a pool. Only admins can ban users.

- **URL**: `/banUser`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "poolId": "67ab611a2260b61be8b0caff",
    "userId": "6792e5ea297fd2ca6f920a66"
  }
  ```
- **Response**:
  - **Success (200)**: Empty response.
  - **Error (404)**:
    ```json
    {
      "error": "Pool not found."
    }
    ```
  - **Error (403)**:
    ```json
    {
      "error": "Only admins can ban a user."
    }
    ```

---

### **Notes**
- All routes require authentication via `authMiddleware`.
- Replace placeholders like `:poolId` and `:token` with actual values.
- Ensure the `Authorization` header is included in all requests.
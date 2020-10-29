const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const authMiddleware = require('../../middlewares/auth');
const User = require('../../graphql/models/auth');

describe('AUTH MIDDLEWARE', () => {
  let token;

  let mockUser = new User({
    _id: mongoose.Types.ObjectId().toHexString(),
    email: '12345',
  });
  token = jwt.sign(
    {
      user_id: mockUser.id,
      email: mockUser.email,
    },
    'secret',
    {
      expiresIn: '1h',
    }
  );

  const req = { headers: { authorization: token } };
  // if in auth middleware , if we were retrieving header like req.headers("authorization") => as a fn
  // we would do req = { headers: jest.fn().mockReturnedValue(token) }
  const res = {};
  const next = jest.fn();

  it('makes req.user === mockUser.id', () => {
    authMiddleware(req, res, next);
    expect(req.userId).toEqual(mockUser.id);
  });
});

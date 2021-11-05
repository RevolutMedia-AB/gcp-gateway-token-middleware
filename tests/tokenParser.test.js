'use strict';
const VALID_FULL_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcHJvamVjdC1pZCIsImF1ZCI6InByb2plY3QtaWQiLCJhdXRoX3RpbWUiOjE2MzYwMjQxMzQsInVzZXJfaWQiOiJBMVVYNkZ4RDliV3JLOW9rRkYzekZwZ2hxRncyIiwic3ViIjoiQTFVWDZGeEQ5YldySzlva0ZGM3pGcGdocUZ3MiIsImlhdCI6MTYzNjAyNDEzNCwiZXhwIjoxNjM2MDI3NzM0LCJwaG9uZV9udW1iZXIiOiJzb21lbnVtYmVyIiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyJzb21lbnVtYmVyIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.nD7yWOEx0le7HJ-gnLPlm0GqXZwcYhYkQdSoXXoSEzM";
const INVALID_FULL_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcHJvamVjdC1pZCIsImF1ZCI6InByb2plY3QtaWQiLCJhdXRoX3RpbWUiOjE2MzYwMjQxMzQsInVzZXJfaWQiOiJBMVVYNkZ4RDliV3JLOW9rRkYzekZwZ2hxRncyIiwic3ViIjoiQTFVWDZGeEQ5YldySzlva0ZGM3pGcGdocUZ3MiIsImlhdCI6MTYzNjAyNDEzNCwiZXhwIjoxNjM2MDI3NzM0LCJwaG9uZV9udW1iZXIiOiJzb21lbnVtYmVyIiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyJzb21lbnVtYmVyIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.kiHp1ooklDdW1a1BXT-jMeIELBBrsBJJDYnf6BYBhTQ";
const VALID_JWT_BODY_ONLY = "eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcHJvamVjdC1pZCIsImF1ZCI6InByb2plY3QtaWQiLCJhdXRoX3RpbWUiOjE2MzYwMjQxMzQsInVzZXJfaWQiOiJBMVVYNkZ4RDliV3JLOW9rRkYzekZwZ2hxRncyIiwic3ViIjoiQTFVWDZGeEQ5YldySzlva0ZGM3pGcGdocUZ3MiIsImlhdCI6MTYzNjAyNDEzNCwiZXhwIjoxNjM2MDI3NzM0LCJwaG9uZV9udW1iZXIiOiJzb21lbnVtYmVyIiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyJzb21lbnVtYmVyIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0";

const tokenParser = require('../index');

const chai = require('chai');
const expect = chai.expect;
describe('token support test', function () {
  context('when called locally using a full JWT token', function () {
    it('req.user should contain the correct information', function () {
      const correctUserObj = {
        "iss": "https://securetoken.google.com/project-id",
        "aud": "project-id",
        "auth_time": 1636024134,
        "user_id": "A1UX6FxD9bWrK9okFF3zFpghqFw2",
        "sub": "A1UX6FxD9bWrK9okFF3zFpghqFw2",
        "iat": 1636024134,
        "exp": 1636027734,
        "phone_number": "somenumber",
        "firebase": {
          "identities": {
            "phone": [
              "somenumber"
            ]
          },
          "sign_in_provider": "phone"
        }
      };
      const middleware = tokenParser();
      const mockReqObject = {
        headers: {
          "authorization": VALID_FULL_JWT
        }
      };
      const mockResObject = {
        status: function () {
          expect.fail("The middleware should not call status on a valid request");
          return {json: () => null};
        },
      }
      let nextWasCalled = false;
      const mockNextCallback = function () {
        nextWasCalled = true;
        expect(mockReqObject.user).to.be.deep.eq(correctUserObj);
      }
      middleware(mockReqObject, mockResObject, mockNextCallback);
      expect(nextWasCalled).to.be.true;
    });
  });

  context('when called by API Gateway which supplies the JWT body only', function () {
    it('req.user should contain the correct information', function () {
      const correctUserObj = {
        "iss": "https://securetoken.google.com/project-id",
        "aud": "project-id",
        "auth_time": 1636024134,
        "user_id": "A1UX6FxD9bWrK9okFF3zFpghqFw2",
        "sub": "A1UX6FxD9bWrK9okFF3zFpghqFw2",
        "iat": 1636024134,
        "exp": 1636027734,
        "phone_number": "somenumber",
        "firebase": {
          "identities": {
            "phone": [
              "somenumber"
            ]
          },
          "sign_in_provider": "phone"
        }
      };
      const middleware = tokenParser();
      const mockReqObject = {
        headers: {
          "x-apigateway-api-userinfo": VALID_JWT_BODY_ONLY
        }
      };
      const mockResObject = {
        status: function () {
          expect.fail("The middleware should not call status on a valid request");
          return {json: () => null};
        },
      }
      let nextWasCalled = false;
      const mockNextCallback = function () {
        nextWasCalled = true;
        expect(mockReqObject.user).to.be.deep.eq(correctUserObj);
      }
      middleware(mockReqObject, mockResObject, mockNextCallback);
      expect(nextWasCalled).to.be.true;
    });
  });

  //TODO - Currently no token signature validation is performed
  xcontext('when called locally using an JWT token with an invalid signature', function () {
    it('should respond with 401 and not call next', function () {
      const middleware = tokenParser();
      const mockReqObject = {
        headers: {
          "authorization": INVALID_FULL_JWT
        }
      };
      let statusWasCalled = false;
      const mockResObject = {
        status: function (code) {
          statusWasCalled = true;
          expect(code).to.be.eq(401);
          return {json: () => null};
        },
      }
      let nextWasCalled = false;
      const mockNextCallback = function () {
        nextWasCalled = true;
      }

      middleware(mockReqObject, mockResObject, mockNextCallback);
      expect(statusWasCalled).to.be.true;
      expect(nextWasCalled).to.be.false;
    });
  });

  context('when called without any valid header info', function () {
    it('should respond with 401 and not call next', function () {
      const middleware = tokenParser();
      const mockReqObject = {
        headers: {}
      };
      let statusWasCalled = false;
      const mockResObject = {
        status: function (code) {
          statusWasCalled = true;
          expect(code).to.be.eq(401);
          return {json: () => null};
        },
      }
      let nextWasCalled = false;
      const mockNextCallback = function () {
        nextWasCalled = true;
      }

      middleware(mockReqObject, mockResObject, mockNextCallback);
      expect(statusWasCalled).to.be.true;
      expect(nextWasCalled).to.be.false;
    });
  });

  context('when called with invalid formatted jwt in either header', function () {
    it('(gateway header) should respond with 401 and not call next', function () {
      const middleware = tokenParser();
      const mockReqObject = {
        headers: {
          "x-apigateway-api-userinfo": "invalid token"
        }
      };
      let statusWasCalled = false;
      const mockResObject = {
        status: function (code) {
          statusWasCalled = true;
          expect(code).to.be.eq(401);
          return {json: () => null};
        },
      }
      let nextWasCalled = false;
      const mockNextCallback = function () {
        nextWasCalled = true;
      }

      middleware(mockReqObject, mockResObject, mockNextCallback);
      expect(statusWasCalled).to.be.true;
      expect(nextWasCalled).to.be.false;
    });

    it('(auth header) should respond with 401 and not call next', function () {
      const middleware = tokenParser();
      const mockReqObject = {
        headers: {
          "authorization": "invalid token"
        }
      };
      let statusWasCalled = false;
      const mockResObject = {
        status: function (code) {
          statusWasCalled = true;
          expect(code).to.be.eq(401);
          return {json: () => null};
        },
      }
      let nextWasCalled = false;
      const mockNextCallback = function () {
        nextWasCalled = true;
      }

      middleware(mockReqObject, mockResObject, mockNextCallback);
      expect(statusWasCalled).to.be.true;
      expect(nextWasCalled).to.be.false;
    });
  });

  context('when called with an invalid req object (missing header property)', function () {
    it('should respond with 401 and not call next', function () {
      const middleware = tokenParser();
      const mockReqObject = {};
      let statusWasCalled = false;
      const mockResObject = {
        status: function (code) {
          statusWasCalled = true;
          expect(code).to.be.eq(401);
          return {json: () => null};
        },
      }
      let nextWasCalled = false;
      const mockNextCallback = function () {
        nextWasCalled = true;
      }

      middleware(mockReqObject, mockResObject, mockNextCallback);
      expect(statusWasCalled).to.be.true;
      expect(nextWasCalled).to.be.false;
    });
  });
});


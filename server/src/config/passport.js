import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import Table from '../table';
import { encode, decode } from '../utils/tokens';

// attaches tables to variables
// table name goes intot the new Table argument
let usersTable = new Table('Users');
let tokensTable = new Table('Tokens');

function configurePassport(app) {
    // local strategy is a library from Passport
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email', // changes the email value in req.body to become the username local strategy is looking for
                passwordField: 'password', // attaches the password value on req.body to be the password local strategy is looking for
                session: false // removes sessions from server
            },
            async (email, password, done) => {
                // usually it is (username, password, done) but it is changed in the above object
                try {
                    // array destructuring. find() will return an array of results.
                    // destructuring the first (and hopefully only) result into the user variable
                    let [user] = await usersTable.find({ email });
                    if (user && user.password && user.password === password) {
                        let idObj = await tokensTable.insert({
                            userid: user.id
                        });
                        let token = encode(idObj.id);
                        return done(null, { token });
                    } else {
                        return done(null, false, {
                            message: 'Invalid credentials'
                        });
                    }
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    // takes the "Authorization" header on the request and checks if it has the value of "Bearer _______" << space between Bearer and token needed
    // example header:     "Authorization": "Bearer PvGrvmqVGQXFE17nDllrxtUglWblQBj8lRQl8RceP1emvwWMbQ4="
    passport.use(
        new BearerStrategy(async (token, done) => {
            let tokenId = decode(token);
            if (!tokenId) {
                return done(null, false, { message: 'Invalid token' });
            }
            try {
                let tokenRecord = await tokensTable.getOne(tokenId);
                let user = await usersTable.getOne(tokenRecord.userid);
                if (user) {
                    delete user.password;
                    return done(null, user); // ater this, req.user is set to the user (no password)
                } else {
                    return done(null, false, { message: 'Invalid token' });
                }
            } catch (err) {
                return done(err);
            }
        })
    );

    app.use(passport.initialize());
}

export default configurePassport;

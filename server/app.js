if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');

const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const mongoSanitize = require('express-mongo-sanitize');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const houseRoutes = require('./routes/houses');
const listingRoutes = require('./routes/listings');
const paymentRoutes = require('./routes/payments');


const dbUrl = process.env.DB_URL || 'mongodb+srv://Levis:Forever%40%4024Forever@clusterflipping.ptkmg.mongodb.net/wyatt?retryWrites=true&w=majority';
mongoose.connect(dbUrl, {});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected")
});


const app = express();

const allowedOrigins = [
    'http://localhost:5173', // Development
    'https://peskaya-98bb2fd3d6e7.herokuapp.com', // Production
    'https://www.peskaya.com',
];

// Middleware
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`)
      else
        next()
    })
}

app.use(express.urlencoded({extended: true, limit: '25mb'}));
app.use(methodOverride('_method'));
app.use(mongoSanitize());
app.use(express.json({ limit: '25mb'}));
app.set('trust proxy', 1);
const secret = process.env.SECRET || '85AGTHRHGYZZ';
const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
    autoRemove: 'interval',
    autoRemoveInterval: 10
});

const sessionConfig = session({
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust for cross-origin
        // secure: true, // Use secure cookies in production
        // sameSite: "none", // Adjust for cross-origin
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 *24 * 7
    }
})
  

app.use(sessionConfig);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/payments', paymentRoutes);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, "../", "client", "dist", "index.html"),
            function(err) {
                if (err) {
                    res.status(500).send(err);
                }
            }
        );
    });
}


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const response = {
        error: {
            message: err.message || 'Something went wrong.',
            status: statusCode,
        },
    };

    if (process.env.NODE_ENV === 'development') {
        response.error.stack = err.stack;
    }

    res.status(statusCode).json(response);
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Backend running on ${port}`);
});
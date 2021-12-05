import express from 'express';
import config from './config/index.js';
import router from './routes/index.js';
import cookieParser from 'cookie-parser'
import history from 'connect-history-api-fallback';
import chalk from 'chalk';

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
const app = express();

app.all('*', (req, res, next) => {
	const { origin, Origin, referer, Referer } = req.headers;
	const allowOrigin = origin || Origin || referer || Referer || '*';

	res.header("Access-Control-Allow-Origin", allowOrigin);
	res.header("Access-Control-Expose-Headers", "OPSESSION");
	res.header("Access-Control-Allow-Headers",
		"Cookie, Origin, X-Requested-With, Content-Type, "
		+ "OPSESSION, i-msg-type, Accept, X-Auth-Token, X-Auth-DEVICE,"
		+ "Authorization, x-requested-with, cache-control, X-Requested-With, "
		+ "Access-Control-Allow-Origin, Access-Control-Allow-Credentials");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Access-Control-Max-Age", "0");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Content-Type", "application/json;charset=utf-8");
	res.header("X-Powered-By", 'Express');

	if (req.method == 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});

// app.use(Statistic.apiRecord)

// app.use(expressWinston.logger({
//     transports: [
//         new (winston.transports.Console)({
//           json: true,
//           colorize: true
//         }),
//         new winston.transports.File({
//           filename: 'logs/success.log'
//         })
//     ]
// }));

app.use(express.json()); 							// for parsing application/json
app.use(express.urlencoded({ extended: false }));   // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
router(app);

// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console({
//           json: true,
//           colorize: true
//         }),
//         new winston.transports.File({
//           filename: 'logs/error.log'
//         })
//     ]
// }));

app.use(history());

//app.use(express.static('./public'));
app.listen(config.port, () => {
	console.log(
		chalk.green(`成功监听端口：${config.port}`)
	)
});

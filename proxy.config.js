import { environment } from '../../../environments/environment';
const PROXY_CONFIG = {
    "/ContabilidadOnline-Tmo/*": {
        "target": environment.IP_SERVIDOR_PUERTO,
        "secure": false,
        "bypass": function(req, res, proxyOptions) {
            if (req.headers.accept.indexOf("html") !== -1) {
                return "/index.html";
            }
            req.headers["X-Custom-Header"] = "yes";

        }

    }
}

module.exports = PROXY_CONFIG;
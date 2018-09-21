from flask import (
    Flask,
    send_from_directory,
    request,
    Blueprint,
    jsonify,
    Response,
    url_for
)
import subprocess, os, urllib, requests, time, daemon, argparse, psutil

from daemon import pidfile

from flask_cors import CORS

app = Flask(__name__)

CORS(app)

def run_yarn_logs(app_id="", container_id="", show_info=False):

    cmd = ['yarn', 'logs', '-applicationId', app_id]

    if show_info:
        cmd.append("-show_container_log_info")

    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if result.returncode == 0:
        return Response(result.stdout, status=200, mimetype="text/plain")
    else:
        return Response(result.stderr, status=500, mimetype="text/plain")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path=""):
    return app.send_static_file('index.html')

@app.route("/api/about")
@app.route("/api/help")
def hello():
    def has_no_empty_params(rule):
        defaults = rule.defaults if rule.defaults is not None else ()
        arguments = rule.arguments if rule.arguments is not None else ()
        return len(defaults) >= len(arguments)

    links = {}
    for rule in app.url_map.iter_rules():
        options = {}
        for arg in rule.arguments:
            options[arg] = "<{0}>".format(arg)

        url = url_for(rule.endpoint,**options)
        line = urllib.parse.unquote(url)

        links[rule.endpoint] = line

    return jsonify({
        "name" : "yoga",
        "description" : "YARN logs viewer",
        "author" : "Thomas Decaux <t.decaux@qwant.com>",
        "version" : "0.0.1",
        "routes" : links
    })

@app.route("/favicon.ico")
def favicon():
    return app.send_static_file('favicon.ico')

@app.route("/robots.txt")
def robots():
    return app.send_static_file('robots.txt')

@app.route("/api/logs")
def get_apps():
    r = requests.get("%s?limit=100&startedTimeBegin=%i" % (os.getenv("YOGA_YARN_API_URL"), 1000*(int(time.time()) - 24*60*60)), headers={"Accept" : "application/json"}, verify=False)

    return Response(r.text, status=200, mimetype="application/json")

@app.route("/api/logs/<yarn_app>")
def get_by_app(yarn_app):
    return run_yarn_logs(app_id=yarn_app)

@app.route("/api/logs/<yarn_app>/info")
def get_by_app_info(yarn_app):
    return run_yarn_logs(app_id=yarn_app, show_info=True)

@app.route("/api/logs/<yarn_app>/<yarn_container>")
def get_by_container(yarn_app, yarn_container):
    return run_yarn_logs(app_id=yarn_app, container_id=yarn_container)

if __name__ == '__main__':

    parser = argparse.ArgumentParser(description="YOGA")
    parser.add_argument('--pid', default='/var/run/yoga.pid')
    parser.add_argument('--log', default='/var/log/yoga/')
    parser.add_argument('--port', default=5005)
    parser.add_argument('--host', default='0.0.0.0')
    parser.add_argument('--debug', default=False)
    parser.add_argument('action', default="foreground")

    args = parser.parse_args()

    if args.action == "start":
        with daemon.DaemonContext(
                working_directory = ".",
                stdout = open(os.path.join(args.log, "out.log"), "w"),
                stderr = open(os.path.join(args.log, "err.log"), "w"),
                pidfile = pidfile.TimeoutPIDLockFile(args.pid)
            ):
            app.debug = args.debug
            app.run(host = args.host,port=args.port)

    elif args.action == "status":
        if os.path.isfile(args.pid):
            with open(args.pid, "r") as f:
                pid = int(f.read())
                p = psutil.Process(pid)
                status = "running (pid: %i, name: %s, cmd: %s)" % (pid, p.name(), p.cmdline())
        else:
            status = "not running (reason: PID file not found!)"
        print("status: %s" % (status))
    elif args.action == "stop":
        if os.path.isfile(args.pid):
            print("exiting...")
            with open(args.pid, "r") as f:
                pid = int(f.read())
                p = psutil.Process(pid)
                p.kill()
                os.remove(args.pid)
                print("killed process %i and remove PID file (%s)!" % (pid, args.pid))
        else:
            print("<!> not running (reason: PID file not found!) <!>")
    elif args.action == "foreground":
        app.debug = args.debug
        app.run(host = args.host,port=args.port)
    else:
        print("ation must be: start / status / stop")

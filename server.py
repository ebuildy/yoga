from flask import (
    Flask,
    send_from_directory,
    request,
    Blueprint,
    jsonify,
    Response,
    url_for
)
import subprocess, os, urllib

app = Flask(__name__)

def run_yarn_logs(app_id="", container_id="", show_info=False):

    cmd = ['yarn', 'logs', '-applicationId', app_id]

    if show_info:
        cmd.append("-show_container_log_info")

    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if result.returncode == 0:
        return Response(result.stdout, status=200, mimetype="text/plain")
    else:
        return Response(result.stderr, status=500, mimetype="text/plain")

@app.route("/")
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

    return jsonify(links)

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'web'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route("/robots.txt")
def robots():
    return send_from_directory(os.path.join(app.root_path, 'web'),
                               'robots.txt', mimetype='application/text')

@app.route("/<yarn_app>")
def get_by_app(yarn_app):
    return run_yarn_logs(app_id=yarn_app)

@app.route("/<yarn_app>/info")
def get_by_app_info(yarn_app):
    return run_yarn_logs(app_id=yarn_app, show_info=True)

@app.route("/<yarn_app>/<yarn_container>")
def get_by_container(yarn_app, yarn_container):
    return run_yarn_logs(app_id=yarn_app, container_id=yarn_container)

if __name__ == '__main__':
    app.debug = False
    app.run(host = '0.0.0.0',port=5005)

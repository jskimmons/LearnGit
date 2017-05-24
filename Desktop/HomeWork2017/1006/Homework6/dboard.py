from flask import Flask, render_template, request
from datetime import datetime

class Entry(object):
     
    def __init__(self, author, date, content):
        self.author = author
        self.date = date
        self.content = content

# create an instance of Flask. (a "Flask process")
app = Flask(__name__) 

post_file = "entries.txt"
password_file = "users.txt"

def read_posts():
    postList = []
    entryList = []
    file = open(post_file, "r")
    for line in file:
        line = line.strip("\n")
        postList.append(line)
    count = 0
    while count < len(postList):
        entryList.append(Entry(postList[count], postList[count+1], postList[count+2]))
        count+=3
    return entryList


def create_post(author, date, content):
    writeFile = open(post_file, "a")
    writeFile.write(author)
    writeFile.write('\n')
    writeFile.write(date)
    writeFile.write('\n')
    writeFile.write(content)
    writeFile.write('\n')
    writeFile.close()

def check_password(user, passwd):
    user = ""
    pwd = ""
    found = False
    passFile = open(password_file, "r")
    for line in passFile:
        pairList = line.split(",")
        user = pairList[0]
        pwd = pairList[1]
        if user == user and pwd == passwd:
            found = True
    return found
    

@app.route('/') 
def dboard():
    if "author" in request.args and "content" in request.args and "password" in request.args:
        if check_password(request.args["author"], request.args["password"]):
            create_post(request.args["author"], str(datetime.now().strftime("%B %d %Y, %I:%M%p")) ,request.args["content"])
            posts = read_posts()
            return render_template("dboard.html", posts = posts)
        else:
            return "ERROR: Incorrect Username or password"
    else:
        posts = read_posts()
        return render_template("dboard.html", posts = posts)


    
@app.route('/compose')  
def compose():    
    return render_template("newpost.html")
        
    
if __name__ == "__main__":
    app.run(debug=True, port=7774)

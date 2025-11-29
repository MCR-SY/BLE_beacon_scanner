from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from routes.apiRoutes import apiRouter

app = FastAPI()
# static files
app.mount("/static", StaticFiles(directory="static"), name="static")
# html templates
templates = Jinja2Templates(directory="templates")

# routes
@app.get("/", response_class=HTMLResponse)
async def read_item(request:Request):
    return templates.TemplateResponse("index.html", {"request": request})

# routers
app.include_router(apiRouter)


# testing params and queries
@app.get("/items/{id}")
def read_item(id: int, q: str | None = None):
    return {"id": id, "q": q}

# testing templates
@app.get("/items", response_class=HTMLResponse)
async def read_item(request: Request):
    # items = db.items.find_one({})
    # print("items")
    return templates.TemplateResponse(
        request=request, name="items.html", context={"items": [{"name":"temp", "value":35}, {"name":"weight", "value":40}]}
    )
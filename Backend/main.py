from fastapi import FastAPI

app = FastAPI(title="Juego de la Vide de Jhon Conway")


@app.get('/')
async def read_rood():
    return {'message':'Juego de la vida!!'}

# main del back

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app",port=8030,reload=True)
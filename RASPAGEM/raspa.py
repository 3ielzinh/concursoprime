import time
import hashlib
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

URL = "https://www.simulado.profdaviconcursos.com.br/"

driver = webdriver.Chrome(ChromeDriverManager().install())
driver.get(URL)

wait = WebDriverWait(driver, 10)

def get_questions():
    elemento = wait.until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="conteudoteste"]'))
    )
    return elemento.text.strip()

def click_next():
    try:
        botao = wait.until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="sonabu"]/a'))
        )
        botao.click()
        time.sleep(2)
        return True
    except:
        return False

def select_subject(index):
    select_element = wait.until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="outro"]'))
    )
    select = Select(select_element)
    select.select_by_index(index)
    time.sleep(2)

def hash_text(text):
    return hashlib.md5(text.encode()).hexdigest()

arquivo_saida = open("questoes.txt", "w", encoding="utf-8")
questoes_unicas = set()

# total de opções no select
select_element = wait.until(
    EC.presence_of_element_located((By.XPATH, '//*[@id="outro"]'))
)
select = Select(select_element)
total_opcoes = len(select.options)

for i in range(total_opcoes):
    print(f"Processando assunto {i+1}/{total_opcoes}")
    select_subject(i)

    while True:
        texto = get_questions()
        h = hash_text(texto)

        if h not in questoes_unicas:
            questoes_unicas.add(h)
            arquivo_saida.write(texto + "\n\n" + "="*80 + "\n\n")
        else:
            print("Questão repetida detectada.")

        if not click_next():
            break

arquivo_saida.close()
driver.quit()

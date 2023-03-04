import math, requests, json

corrupted_soil = True
enchanted_lava_bucket = False
enchanted_magma_bucket = False
enchanted_plasma_bucket = True
minions = 10
cooldown_duration = 12

if enchanted_lava_bucket:
    cooldown_duration = 12 / 1.25
if enchanted_magma_bucket:
    cooldown_duration = 12 / 1.3
if enchanted_plasma_bucket:
    cooldown_duration = 12 / 1.35

one_cycle = cooldown_duration * 2
second_in_day = 86400
cycles = math.floor(second_in_day/one_cycle)

money = 0

# item_id = [enchanted slimeball, slimeball, enchanted sulphur]
item_id = ["ENCHANTED_SLIME_BALL", "SLIME_BALL", "ENCHANTED_SULPHUR"]

# prices = [enchanted slimeball, slimeball, enchanted sulphur, sulphur, corrupted fragment]
prices = [0, 0, 0, 10 * corrupted_soil, 20 * corrupted_soil]

for i in range(2):
    data = json.loads(requests.get("https://api.slothpixel.me/api/skyblock/bazaar/"+item_id[i]).content)
    prices[i] = data["quick_status"]["sellPrice"]

data = json.loads(requests.get("https://api.slothpixel.me/api/skyblock/bazaar/"+item_id[2]).content)
prices[2] = data["quick_status"]["sellPrice"] * corrupted_soil

counts = [math.floor(cycles/192), cycles % 192, cycles]

money += math.floor(cycles/192) * prices[0]
money += math.floor(cycles/192) * prices[2]
money += cycles * prices[1]
money += cycles * prices[3] * 0.9
money += cycles * prices[4] * 0.9

total_money = math.floor(money * minions)

print(total_money)

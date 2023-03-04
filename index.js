var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

function displayResults(minions, cooldown_duration, cycles, prices, money, total_money) {
    stringified_minions = ""
    if (minions == 1) {
        stringified_minions = "1 minion"
    } else {
        stringified_minions = minions+" minions"
    }
    document.getElementById("results").innerHTML = `
    <h1>Minion Cooldown Duration: `+cooldown_duration+`</h1>
    <h1>Cycles Per Day: `+cycles+`</h1>
    <h1>Price of Enchanted Slimeballs: `+Math.floor(prices[0])+` coins</h1>
    <h1>Price of Slimeballs: `+Math.floor(prices[1])+` coins</h1>
    <h1>Price of Enchanted Sulphur: `+Math.floor(prices[2])+` coins</h1>
    <p>Price of Enchanted Sulphur will be 0 if you aren't using corrupt soil.</p>
    <h1>Profit Per Minion Per Day: `+Math.floor(money)+` coins</h1>
    <h1>Profit Per Day In Total (`+stringified_minions+`): `+Math.floor(total_money)+` coins</h1>
    `
}

function calculate() {
    var corrupted_soil = document.getElementById("yessoil").checked
    var enchanted_lava_bucket = document.getElementById("elava").checked
    var enchanted_magma_bucket = document.getElementById("magma").checked
    var enchanted_plasma_bucket = document.getElementById("plasma").checked
    var minions = document.getElementById("minions").value
    var cooldown_duration = 12

    if (enchanted_lava_bucket) {
        cooldown_duration = 12 / 1.25
    }
    if (enchanted_magma_bucket) {
        cooldown_duration = 12 / 1.3
    }
    if (enchanted_plasma_bucket) {
        cooldown_duration = 12 / 1.35
    }

    var one_cycle = cooldown_duration * 2
    var second_in_day = 86400
    var cycles = Math.floor(second_in_day/one_cycle)

    var money = 0

    var item_id = ["ENCHANTED_SLIME_BALL", "SLIME_BALL", "ENCHANTED_SULPHUR"]

    var prices = [0, 0, 0, 10 * corrupted_soil, 20 * corrupted_soil]

    getJSON("https://api.slothpixel.me/api/skyblock/bazaar/"+item_id[0], (err, data) => {
        if (err !== null) {
            alert('Something went wrong, try again later');
        } else {
            prices[0] = data.quick_status.sellPrice
            getJSON("https://api.slothpixel.me/api/skyblock/bazaar/"+item_id[1], (err, data) => {
                if (err !== null) {
                    alert('Something went wrong, try again later');
                } else {
                    prices[1] = data.quick_status.sellPrice
                    getJSON("https://api.slothpixel.me/api/skyblock/bazaar/"+item_id[2], (err, data) => {
                        if (err !== null) {
                            alert('Something went wrong, try again later');
                        } else {
                            prices[2] = data.quick_status.sellPrice * corrupted_soil

                            money += Math.floor(cycles/192) * prices[0]
                            money += Math.floor(cycles/192) * prices[2]
                            money += cycles * prices[1]
                            money += cycles * prices[3] * 0.9
                            money += cycles * prices[4] * 0.9

                            total_money = Math.floor(money * minions)

                            displayResults(minions, cooldown_duration, cycles, prices, money, total_money)

                        }
                    })
                }
            })
        }
    })
}
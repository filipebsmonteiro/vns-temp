$(function($) {

    let isRequesting = false;
    let vnsString = null;

    let request = async $ => {
        isRequesting = true;
        await $.ajax({
            url: 'https://us-central1-tribal-dispatch-269921.cloudfunctions.net/contactless_api',
            type: 'POST',
            data: {VNS_CONTACTLESS: vnsString},
            contentType: 'text/plain',
            success: function (data) {
                console.log('success')
                console.log(data)
                if (data.startsWith('  Medindo') || data.startsWith('  aguarde')) {
                    $('#div-chamada').hide()
                    $('#div-medindo').show()
                    $('#div-temperatura').hide()
                    $('#temperatura').html('')
                }else if (data.startsWith('   Sua')) {
                    $('#div-chamada').hide()
                    $('#div-medindo').hide()
                    $('#div-temperatura').show()
                    const numero = parseFloat( data.match(/\d+/) );
                    const temperatura = numero.toFixed(1)
                    $('#temperatura').html(`Sua temperatura é: ${temperatura} ºC`)
                }else {
                    $('#div-chamada').show()
                    $('#div-medindo').hide()
                    $('#div-temperatura').hide()
                    $('#temperatura').html('')
                }
            },
            error : function(error){
                console.log('error')
                console.log(error)
            }
        });
        isRequesting = false;
    }

    let selectVns = (string) => {
        vnsString = string
        $('#div-select-vns').hide()
        $('#div-chamada').show()

        request($)

        setInterval(async () => {
            if (!isRequesting){
                await request($)
            }
        }, 2000);
    }

    document.getElementById('VNS0001').addEventListener('click', () => selectVns('VNS0001'))
    document.getElementById('VNS0002').addEventListener('click', () => selectVns('VNS0002'))
    document.getElementById('VNS0003').addEventListener('click', () => selectVns('VNS0003'))
    document.getElementById('VNS0004').addEventListener('click', () => selectVns('VNS0004'))
});
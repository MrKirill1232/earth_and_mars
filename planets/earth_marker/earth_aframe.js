document.addEventListener("DOMContentLoaded", () =>
{
    startRotation();
});

function startRotation()
{
    const currTime = Date.now();

    const earth = document.querySelector('#Earth');
    if (earth != null)
    {
        // earth.object3D.rotation.x = ((earth.object3D.rotation.x >= 360) ? 0 : (earth.object3D.rotation.x + 0.001));
        earth.object3D.rotation.y = ((earth.object3D.rotation.y >= 360) ? 0 : (earth.object3D.rotation.y + 0.001));
        // earth.object3D.rotation.z = ((earth.object3D.rotation.z >= 360) ? 0 : (earth.object3D.rotation.z + 0.001));
    }
    const iss = document.querySelector('#iss');
    if (iss != null)
    {
        let issRadius = parseInt(  iss.getAttribute("animationRadius")) * iss.object3D.scale.getComponent(0);
        let issSpeed  = parseFloat(iss.getAttribute("animationSpeed" ));

        iss.object3D.rotation.y = ((iss.object3D.rotation.y >= 360) ? 0 : (iss.object3D.rotation.y + issSpeed / 500));
        iss.object3D.position.setX(issRadius * Math.cos(issSpeed * currTime / 1000));
        iss.object3D.position.setY((issRadius * Math.sin(issSpeed * currTime / 1000 * Math.sqrt(2))) / 2.);
        iss.object3D.position.setZ(issRadius * Math.sin(issSpeed * currTime / 1000));
    }
    const satellites = [document.querySelector('#moon')];

    for (let satellite of satellites)
    {
        if (satellite == null)
        {
            continue;
        }

        let radius = parseInt(  satellite.getAttribute("animationRadius")) * satellite.object3D.scale.getComponent(0);
        let speed  = parseFloat(satellite.getAttribute("animationSpeed" ));

        satellite.object3D.position.setX(radius * Math.cos(speed * currTime / 1000));
        satellite.object3D.position.setY(0);
        satellite.object3D.position.setZ(radius * Math.sin(speed * currTime / 1000));
    }

    requestAnimationFrame(startRotation);
}

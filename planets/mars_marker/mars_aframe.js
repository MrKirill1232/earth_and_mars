document.addEventListener("DOMContentLoaded", () =>
{
    startRotation();
});

function startRotation()
{
    const currTime = Date.now();

    const mars = document.querySelector('#mars');
    if (mars != null)
    {
        // mars.object3D.rotation.x = ((mars.object3D.rotation.x >= 360) ? 0 : (mars.object3D.rotation.x + 0.001));
        mars.object3D.rotation.y = ((mars.object3D.rotation.y >= 360) ? 0 : (mars.object3D.rotation.y + 0.001));
        // mars.object3D.rotation.z = ((mars.object3D.rotation.z >= 360) ? 0 : (mars.object3D.rotation.z + 0.001));
    }
    const satellites = [document.querySelector('#phobos'), document.querySelector('#deimos')];

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

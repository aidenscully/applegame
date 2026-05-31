export class Gun extends Item {
  constructor({ name, description, icon, playericon, sfx, damage, bulletSpeed, bulletSpread, bulletIcon, fireRate, reloadTime, bulletCount, range, bulletPenetration, lastFired, isReloading, ammo, maxAmmo,  }) {
    super({ name, description, icon, playericon, sfx });
    this.damage = damage;
    this.bulletSpeed = bulletSpeed;
    this.bulletSpread = bulletSpread;
    this.bulletIcon = bulletIcon;
    this.fireRate = fireRate;
    this.reloadTime = reloadTime;
    this.bulletCount = bulletCount;
    this.range = range;
    this.bulletPenetration = bulletPenetration;
  }
}

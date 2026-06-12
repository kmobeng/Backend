resource "digitalocean_droplet" "todo_app" {
  image    = "ubuntu-22-04-x64"
  name     = "todo-app-server"
  region   = "lon1"
  size     = "s-1vcpu-1gb"
  ssh_keys = [var.ssh_key_fingerprint]
}
output "droplet_ip" {
  value = digitalocean_droplet.todo_app.ipv4_address
}
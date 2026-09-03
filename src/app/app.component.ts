import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';

type Role = 'client' | 'professional' | 'admin';
type View = 'home' | 'search' | 'appointments' | 'social' | 'dashboard';

interface Professional {
  name: string; specialty: string; zone: string; rating: number; reviews: number;
  image: string; verified: boolean; price: number;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly role = signal<Role | null>(null);
  readonly view = signal<View>('home');
  readonly menuOpen = signal(false);
  readonly query = signal('');
  readonly hero = 'https://cdn.b12.io/client_media/kvKvc0V1/58d6f65e-9cc7-11f1-b027-0242ac110002-AKP71UMx-_9K5-GTo7k8-_dQMEBTqC.jpg';
  readonly categories = [
    { name: 'Manicure', icon: '✦' }, { name: 'Pedicure', icon: '♡' },
    { name: 'Cabello', icon: '✂' }, { name: 'Facial', icon: '◌' },
    { name: 'Maquillaje', icon: '✧' }, { name: 'Masajes', icon: '≈' },
  ];
  readonly professionals: Professional[] = [
    { name: 'María Rodríguez', specialty: 'Nail Artist', zone: 'Ensanche Naco', rating: 4.9, reviews: 127, price: 800, verified: true, image: 'https://cdn.b12.io/client_media/kvKvc0V1/5950a95d-9cc7-11f1-be61-0242ac110002-X0DlyrM7oyHJngp3bvtn8_S8eqbuoS.jpg' },
    { name: 'Ana Martínez', specialty: 'Hair Stylist', zone: 'Piantini', rating: 4.8, reviews: 98, price: 1500, verified: true, image: 'https://cdn.b12.io/client_media/kvKvc0V1/58623a89-9cc7-11f1-8497-0242ac110002-tzCiRBfUlRECg_vMzc_qN_jMHwIioS.jpg' },
    { name: 'Carmen López', specialty: 'Especialista facial', zone: 'Bella Vista', rating: 5, reviews: 74, price: 2000, verified: true, image: 'https://cdn.b12.io/client_media/kvKvc0V1/594fc3f2-9cc7-11f1-8b92-0242ac110002-EYS7olFp-X6MApbWwCsMk_74E7ogac.jpg' },
    { name: 'Laura Díaz', specialty: 'Makeup Artist', zone: 'Santo Domingo Este', rating: 4.9, reviews: 156, price: 2500, verified: true, image: 'https://cdn.b12.io/client_media/kvKvc0V1/59b10f34-9cc7-11f1-9d39-0242ac110002--MwwCjKGm2tTf_prot-4P_lIPL9QFd.jpg' },
  ];
  readonly posts = [
    { professional: 'María Rodríguez', text: '¡Nuevo diseño de nail art para esta temporada! 🌸', likes: 24, image: 'https://cdn.b12.io/client_media/kvKvc0V1/5971bfec-9cc7-11f1-8b7b-0242ac110002-bRSWTl25kk33sAQMgtuQC_wJBksXeu.jpg' },
    { professional: 'Ana Martínez', text: 'Resultado de balayage de hoy. Natural y brillante ✨', likes: 45, image: 'https://cdn.b12.io/client_media/kvKvc0V1/58623a89-9cc7-11f1-8497-0242ac110002-tzCiRBfUlRECg_vMzc_qN_jMHwIioS.jpg' },
    { professional: 'Laura Díaz', text: 'Maquillaje de novia para una boda en la playa 💍', likes: 67, image: 'https://cdn.b12.io/client_media/kvKvc0V1/59b10f34-9cc7-11f1-9d39-0242ac110002--MwwCjKGm2tTf_prot-4P_lIPL9QFd.jpg' },
  ];
  readonly filteredProfessionals = computed(() => {
    const term = this.query().trim().toLocaleLowerCase();
    return term ? this.professionals.filter(p => `${p.name} ${p.specialty} ${p.zone}`.toLocaleLowerCase().includes(term)) : this.professionals;
  });

  login(role: Role) { this.role.set(role); this.view.set(role === 'client' ? 'home' : 'dashboard'); }
  logout() { this.role.set(null); this.view.set('home'); this.menuOpen.set(false); }
  navigate(view: View) { this.view.set(view); this.menuOpen.set(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  explore(category = '') { this.query.set(category); this.navigate('search'); }
  updateQuery(value: string) { this.query.set(value); }
  roleLabel() { return this.role() === 'professional' ? 'Profesional' : this.role() === 'admin' ? 'Admin' : 'Cliente'; }
}

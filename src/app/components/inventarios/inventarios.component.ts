import {
  Component,
  OnInit
} from "@angular/core";

@Component({
  selector: "app-inventarios",
  templateUrl: "./inventarios.component.html",
  styleUrls: ["./inventarios.component.css"],
})
export class InventariosComponent implements OnInit {
  indRegInventario: boolean;
  indActInventario: boolean;

  constructor() {}

  ngOnInit() {
  }

  onClickRegistrarInventario() {
    this.indActInventario = false;
    this.indRegInventario = true;
  }

  onClickActualizarInventario() {
    this.indRegInventario = false;
    this.indActInventario = true;
  }
}

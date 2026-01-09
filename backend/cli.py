import typer
import pandas as pd

from backend.services.upload_service import ingest_dataframe

app = typer.Typer(help="Explainable Banking Anomaly Detection CLI")

@app.command()
def upload(
    csv: str = typer.Option(..., "--csv", "-c", help="Path to CSV file"),
    simulation: bool = typer.Option(True, help="Enable simulation mode"),
):
    """
    Upload CSV via CLI (same pipeline as frontend).
    """
    typer.echo("📂 Reading CSV...")
    df = pd.read_csv(csv, nrows=750_000)

    typer.echo("🤖 Running anomaly detection...")
    result = ingest_dataframe(df, simulation)

    typer.echo("✅ Upload complete")
    for k, v in result.items():
        typer.echo(f"{k}: {v}")

if __name__ == "__main__":
    app()
